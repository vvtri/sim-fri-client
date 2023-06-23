import { ChangeEventHandler } from 'react';
import ReactTextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize';

type MultilineInputProps = {
  value?: any;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
} & TextareaAutosizeProps;

export const MultilineInput = ({
  onChange,
  value,
  style,
  ...rest
}: MultilineInputProps) => {
  return (
    <ReactTextareaAutosize
      value={value}
      onChange={onChange}
      style={{
        display: 'block',
        width: '100%',
        outline: 'none',
        border: 'none',
        resize: 'none',
        backgroundColor: 'transparent',
        padding: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        userSelect: 'text',
        color: 'inherit',
        fontFamily: 'inherit',
        fontSize: '0.9375rem',
        ...style,
      }}
      {...rest}
    />
  );
};
