import React from 'react';
import { Controller } from 'react-hook-form';

export default function MyIMGField({ control, name }) {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ['image/'];

    if (!allowedTypes.includes(selectedFile.type)) {
      return { error: 'Please select a PNG or JPEG file' };
    } else {
      return selectedFile;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={{ required: 'No file selected' }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <input
            type="file"
            onChange={(e) => {
              const file = handleFileChange(e);
              if (file.error) {
                error.message = file.error;
              } else {
                onChange(file);
              }
            }}
          />
          {error && <p>{error.message}</p>}
        </div>
      )}
    />
  );
}