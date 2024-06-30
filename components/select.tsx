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
      classNames={{
        control: () =>
          "w-full rounded-md border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      }}
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
