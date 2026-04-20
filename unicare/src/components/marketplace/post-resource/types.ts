export interface PostFormData {
  name: string;
  discipline: string;
  description: string;
  files: File[];
  previews: string[];
  exchangeType: "lend" | "sell";
  maxDuration: string;
  deposit: string;
  price: string;
  promise: boolean;
}

export const INITIAL_FORM_DATA: PostFormData = {
  name: "",
  discipline: "",
  description: "",
  files: [],
  previews: [],
  exchangeType: "lend",
  maxDuration: "",
  deposit: "",
  price: "",
  promise: false,
};

export interface StepProps {
  form: PostFormData;
  update: <K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K],
  ) => void;
  onNext: () => void;
  onBack: () => void;
}
