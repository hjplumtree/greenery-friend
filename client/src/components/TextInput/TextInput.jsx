import { InputWrap, Input, Label } from "./TextInput.style";

export default function TextInput({
  title,
  type,
  placeholder,
  autoComplete,
  minLength,
  maxLength,
  onChange,
}) {
  return (
    <InputWrap>
      {title && <Label htmlFor={title}>{title}</Label>}
      <Input
        id={title}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        onChange={event => onChange(event.target.value)}
      ></Input>
    </InputWrap>
  );
}
