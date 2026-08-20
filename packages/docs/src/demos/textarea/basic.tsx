import { Textarea } from '@manti-ui/react';

export default function TextareaBasic() {
  return (
    <div className="textarea-field">
      <Textarea
        label="Recipe notes"
        placeholder="Add preparation notes"
        description="Shown below the field while there is no error."
      />
    </div>
  );
}
