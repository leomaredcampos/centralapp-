import { useState } from "react";
import { saveUser } from "./saveUser";

export function useUserInfoActions(form: Record<string, string>, selectedApps: string[], files: FileList | null) {
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await saveUser(form, selectedApps, files);
      alert("User saved successfully.");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, handleSave };
}
