export class QueryFeatures {
  public query: any;
  public queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.where = JSON.parse(queryStr);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      // Prisma sort format is different (e.g. { created_at: 'desc' })
      // For now, simple implementation assuming one field sort or custom logic needed per handler if complex
      // Let's assume the handler passes a Prisma-compatible query object or we adapt here.
      // Actually, for Prisma, "sort" usually translates to `orderBy`.
      // Let's handle simple cases: sort=-created_at => orderBy: { created_at: 'desc' }
      
      const sortParams = this.queryString.sort.split(",");
      const orderBy = sortParams.map((param: string) => {
        const direction = param.startsWith("-") ? "desc" : "asc";
        const field = param.replace("-", "");
        return { [field]: direction };
      });
      
      this.query.orderBy = orderBy;
    } else {
      this.query.orderBy = { created_at: "desc" };
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.skip = skip;
    this.query.take = limit;

    return this;
  }
}
