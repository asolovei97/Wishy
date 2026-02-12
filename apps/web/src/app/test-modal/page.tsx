"use client";

import { Modal } from "../_components/modal/Modal";
import { Button } from "../_components";

export default function TestModalPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Modal Component Test</h1>
      
      <Modal>
        <Modal.Trigger>
          <Button>Open Modal</Button>
        </Modal.Trigger>
        
        <Modal.Content>
          <Modal.Header>
            Test Modal Header
          </Modal.Header>
          
          <Modal.ContentArea>
            <div className="space-y-4">
              <p>This is the modal content. It should be scrollable if it exceeds the fixed height.</p>
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>Line {i + 1}: More content to test scrolling...</p>
              ))}
            </div>
          </Modal.ContentArea>
          
          <Modal.Footer>
            <div className="flex justify-end gap-2">
              <Modal.Trigger>
                <Button variant="outline">Cancel</Button>
              </Modal.Trigger>
              <Button>Confirm</Button>
            </div>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
