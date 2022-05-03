import { useCombobox, UseComboboxStateChange } from "downshift";
import * as React from "react";
import { useField, useIsSubmitting } from "remix-validated-form";
import { ClientOnly } from "remix-utils";
export type InputProps = {
  label: string;
  name: string;
  optional?: boolean;
  className?: string;
  defaultValue?: string;
  type?: string;
  wide?: boolean;
};

export const FormInput: React.FC<
  InputProps & JSX.IntrinsicElements["input"]
> = ({
  label,
  name,
  optional,
  className,
  type = "text",
  onChange,
  wide,
  ...rest
}) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className={`form-control w-full max-w-xs lg:max-w-full ${className}`}>
      <label className="label" htmlFor={name}>
        <span className="label-text">{label}</span>
      </label>
      <input
        {...getInputProps({
          type: type,
          id: name,
          className: `input input-bordered w-full max-w-xs lg:max-w-full ${
            error && "input-error"
          } ${wide ? "lg:max-w-full" : ""}`,
          ...rest,
        })}
      />
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </label>
    </div>
  );
};

export const FormTextarea: React.FC<
  InputProps & JSX.IntrinsicElements["textarea"]
> = ({ label, name, className, ...rest }) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="form-control w-full max-w-xs lg:max-w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        {...getInputProps({
          className: `textarea textarea-bordered h-24 ${
            error && "textarea-error lg:max-w-full"
          }`,
          id: name,
          ...rest,
        })}
      ></textarea>
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </label>
    </div>
  );
};

// TODO: Update
export function FormToggle({
  name,
  label,
  checked = undefined,
  onChange,
}: {
  name: string;
  label: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="form-control w-full max-w-xs lg:max-w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        onChange={onChange}
        checked={checked}
        type="checkbox"
        className="toggle"
        name={name}
      />
    </div>
  );
}

// type SelectProps = React.FC<InputProps & JSX.IntrinsicElements["select"]>
// export const FormSelect = React.forwardRef<SelectProps>(( {label, name, className}, ref, ...rest) => {
type SelectProps = InputProps & JSX.IntrinsicElements["select"];
export const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, name, className, children }: SelectProps,
    ref?: React.ForwardedRef<HTMLSelectElement>
  ) => {
    const { error, getInputProps } = useField(name);

    return (
      <div className="form-control w-full max-w-xs lg:max-w-full">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <select
          {...getInputProps({
            id: name,
            ref: ref,
            className: `select select-bordered ${
              error && "select-error"
            } ${className}`,
          })}
        >
          {children}
        </select>
        <label className="label">
          {error && <span className="label-text-alt text-error">{error}</span>}
        </label>
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

export function FormAutoComplete({
  name,
  label,
  values,
  itemToValue,
  itemToString,
}: {
  name: string;
  label: string;
  values: any[];
  itemToValue: (item: any) => any;
  itemToString: (item: any) => string;
}) {
  const { error } = useField(name);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputItems, setInputItems] = React.useState(values);
  const [value, setValue] = React.useState("");
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getInputProps,
    selectItem,
    setInputValue,
    getComboboxProps,
  } = useCombobox({
    items: inputItems,
    itemToString,
    onInputValueChange: ({ inputValue = "" }) => {
      setInputItems(
        values.filter((item) =>
          itemToString(item).toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setValue(itemToValue(selectedItem));
    },
  });

  return (
    <div
      {...getComboboxProps({
        id: "form-control-nomination",
        "aria-owns": "menu-nomination",
      })}
      className="form-control w-full max-w-xs lg:max-w-full"
    >
      <label
        {...getLabelProps({
          htmlFor: "nomination",
          id: "label-nomination",
        })}
        className="label"
      >
        <span className="label-text">{label}</span>
      </label>
      <input type="hidden" value={value} name={name} />
      <input
        placeholder="Nomination"
        {...getInputProps({
          name: `${name}-string`,
          id: "input-nomination",
          "aria-controls": "menu-nomination",
          "aria-labelledby": "label-nomination",
          ref: inputRef,
        })}
        className={`input input-bordered w-full max-w-xs lg:max-w-full ${
          error && "input-error"
        }`}
      />
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </label>
      <div
        {...getMenuProps({
          id: "menu-nomination",
          "aria-labelledby": "label-nomination",
        })}
        className={`dropdown ${isOpen && "dropdown-open"}`}
      >
        <ul className="dropdown-content menu rounded-box max-h-56 w-52 overflow-y-auto bg-base-100 p-2 shadow">
          {isOpen &&
            inputItems.length > 0 &&
            inputItems.map((item, index) => (
              <li
                key={`${itemToString(item)}${index}`}
                {...getItemProps({ item, index })}
              >
                <a>{itemToString(item)}</a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export const FormSubmit = ({
  label = "Submit",
  className,
  wide,
  labelSubmitting = "Submitting...",
}: {
  label?: string;
  className?: string;
  wide?: boolean;
  labelSubmitting?: string;
}) => {
  const isSubmitting = useIsSubmitting();
  return (
    <div className={`form-control w-full max-w-xs pt-4 ${className}`}>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary ${wide ? "btn-block " : "w-auto"}`}
      >
        {isSubmitting ? labelSubmitting : label}
      </button>
    </div>
  );
};

export const FormSubmitSimple = ({
  label = "Submit",
  labelSubmitting = "Submitting...",
}: {
  label?: string;
  labelSubmitting?: string;
}) => {
  const isSubmitting = useIsSubmitting();
  return (
    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
      {isSubmitting ? labelSubmitting : label}
    </button>
  );
};
