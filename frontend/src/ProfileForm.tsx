import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type ProfileFormData = {
  bio: string;
  birthDate: string;
  city: string;
  country: string;
  gender: string;
  datingIntent: string;
};

const emptyProfile: ProfileFormData = {
  bio: "",
  birthDate: "",
  city: "",
  country: "",
  gender: "",
  datingIntent: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState<ProfileFormData>(emptyProfile);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("http://localhost:3000/profiles/me", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load your profile.");
        }

        const profile = await response.json();

        if (profile) {
          setForm({
            bio: profile.bio ?? "",
            birthDate: profile.birthDate ? profile.birthDate.slice(0, 10) : "",
            city: profile.city ?? "",
            country: profile.country ?? "",
            gender: profile.gender ?? "",
            datingIntent: profile.datingIntent ?? "",
          });
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your profile.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    const payload = {
      bio: form.bio || undefined,
      birthDate: form.birthDate || undefined,
      city: form.city || undefined,
      country: form.country || undefined,
      gender: form.gender || undefined,
      datingIntent: form.datingIntent || undefined,
    };

    try {
      const response = await fetch("http://localhost:3000/profiles/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save your profile.");
      }

      setMessage("Your profile was saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p>Loading your profile...</p>;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm font-medium">Bio</span>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          maxLength={500}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows={4}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Date of birth</span>
        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">City</span>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Country</span>
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Gender</span>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        >
          <option value="">Choose one</option>
          <option value="WOMAN">Woman</option>
          <option value="MAN">Man</option>
          <option value="NON_BINARY">Non-binary</option>
          <option value="OTHER">Other</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Dating intention</span>
        <select
          name="datingIntent"
          value={form.datingIntent}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        >
          <option value="">Choose one</option>
          <option value="LONG_TERM">Long-term relationship</option>
          <option value="SHORT_TERM">Short-term relationship</option>
          <option value="FRIENDSHIP">Friendship</option>
          <option value="CASUAL">Casual</option>
          <option value="OPEN_TO_ANYTHING">Open to anything</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save profile"}
      </button>

      {message && (
        <p aria-live="polite" className="text-sm text-slate-700">
          {message}
        </p>
      )}
    </form>
  );
}
