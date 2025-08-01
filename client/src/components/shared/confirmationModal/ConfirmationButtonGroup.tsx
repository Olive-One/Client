import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'

interface ConfirmationButtonGroupProps {
    cancelButtonText: string;
    submitButtonText: string;
    onCancel: () => void;
    onSubmit: () => void;
}

const ConfirmationButtonGroup = ({ cancelButtonText, submitButtonText, onCancel, onSubmit }: ConfirmationButtonGroupProps) => {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline" onClick={onCancel}>{cancelButtonText}</Button>
      </DialogClose>
      <Button type="submit" onClick={onSubmit}>{submitButtonText}</Button>
    </DialogFooter>
  );
}

export default ConfirmationButtonGroup