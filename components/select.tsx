import CreatableSelect from "react-select/creatable";

type props = {
  isLoading: boolean;
  onChange: (...event: any[]) => void;
  onCreateOption: (inputValue: string) => void;
  options: { value: string; label: string }[];
  value: { value: string; label: string }[];
};
export default function Select({ isLoading, onChange, onCreateOption, options, value }: props) {
  return (
    <CreatableSelect
      isMulti
      isClearable
      value={value}
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={onChange}
      onCreateOption={onCreateOption}
      /* @ts-ignore */
      options={options}
    />
  );
}
