import { cn } from "@/lib/utils";
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
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "@apply bg-background rounded-md text-background *:bg-background",
        }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 7,
        colors: {
          ...theme.colors,
          primary25: "hsl(var(--primary))", // option hover
          primary: "hsl(var(--input))", // border
          neutral0: "hsl(var(--card))", // option container
          neutral20: "hsl(var(--primary))", // separator in the input
          neutral10: "hsl(var(--primary))", // selected option in the input
          neutral50: "hsl(var(--muted-foreground))", // placeholder
          neutral60: "hsl(var(--muted-foreground))", // buttons in the input
        },
      })}
      classNames={{
        control: (state) =>
          cn(
            state.isFocused ? "border-red-500" : "border-green-500",
            "w-full border border-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ),
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
