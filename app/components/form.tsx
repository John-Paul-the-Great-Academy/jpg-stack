import { useCombobox, UseComboboxStateChange } from "downshift";
import * as React from "react";
import { useField, useIsSubmitting } from "remix-validated-form";
import { ClientOnly } from "remix-utils";

export function FormInput({
  name,
  label,
  defaultValue,
  className,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  const { error } = useField(name);

  return (
    <div className={`form-control w-full max-w-xs lg:max-w-lg ${className}`}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        name={name}
        className={`input input-bordered w-full max-w-xs lg:max-w-lg ${
          error && "input-error"
        }`}
      />
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </label>
    </div>
  );
}

export function FormTextarea({ name, label }: { name: string; label: string }) {
  const { error } = useField(name);

  return (
    <div className="form-control w-full max-w-xs lg:max-w-lg">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        className={`textarea textarea-bordered h-24 ${
          error && "textarea-error lg:max-w-lg"
        }`}
        name={name}
      ></textarea>
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </label>
    </div>
  );
}

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
    <div className="form-control w-full max-w-xs lg:max-w-lg">
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

export const FormSelect = React.forwardRef(function FormSelect(
  {
    name,
    label,
    defaultValue,
    multiple,
    className,
    children,
  }: {
    name: string;
    label: string;
    defaultValue?: string;
    multiple?: boolean;
    className?: string;
    children: React.ReactNode;
  },
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  const { error } = useField(name);

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        name={name}
        multiple={multiple}
        ref={ref}
        defaultValue={multiple ? undefined : defaultValue}
        className={`select select-bordered ${
          error && "select-error"
        } ${className}`}
      >
        {children}
      </select>
      <label className="label">
        {error && <span className="label-text-alt text-error">{error}</span>}
      </label>
    </div>
  );
});

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
      className="form-control w-full max-w-xs lg:max-w-lg"
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
        className={`input input-bordered w-full max-w-xs lg:max-w-lg ${
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
  labelSubmitting = "Submitting...",
}: {
  label?: string;
  labelSubmitting?: string;
}) => {
  const isSubmitting = useIsSubmitting();
  return (
    <div className="form-control w-full max-w-xs pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
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
