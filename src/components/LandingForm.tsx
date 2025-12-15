import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

type LandingFormProps = {
  defaultValue?: string;
  disabled?: boolean;
  onSubmit: (value: string) => void;
};

function LandingForm({ defaultValue = "", disabled = false, onSubmit }: LandingFormProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed.replace(/^u\//, ""));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <label className="text-sm font-semibold text-white" htmlFor="username-input">
        Reddit-användarnamn
      </label>
      <div className="input-shell">
        <span className="text-slate-400">u/</span>
        <input
          id="username-input"
          name="username"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="spez"
          autoComplete="off"
          required
          disabled={disabled}
        />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="button-primary w-full justify-center"
        disabled={disabled}
      >
        Spara användarnamn
      </motion.button>
    </form>
  );
}

export default LandingForm;
