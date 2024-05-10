import { useState } from 'react';

interface IInitialValues {
  [key: string]: string;
}

export function useForm(initialValues: IInitialValues) {
  const [values, setValues] = useState<IInitialValues>(initialValues);

  const handleChange = (
    name: keyof IInitialValues,
    value: string | ((prevValue: string) => string)
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: typeof value === 'function' ? value(prevValues[name]) : value
    }));
  };

  return { values, handleChange };
}
