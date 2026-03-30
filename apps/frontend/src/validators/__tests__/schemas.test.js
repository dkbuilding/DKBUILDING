import { describe, it, expect } from "vitest";
import { contactFormSchema } from "../schemas";

describe("contactFormSchema", () => {
  it("rejette un formulaire vide", () => {
    const result = contactFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("valide un formulaire complet valide", () => {
    const result = contactFormSchema.safeParse({
      projectType: "charpente",
      surface: "100",
      deadline: "3-6mois",
      location: "Albi",
      projectDetails: "Construction d'une charpente metallique",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
      message: "Bonjour, je souhaite un devis pour mon projet.",
    });
    expect(result.success).toBe(true);
  });

  it("valide un formulaire avec seulement les champs obligatoires", () => {
    const result = contactFormSchema.safeParse({
      projectType: "bardage",
      name: "Marie Martin",
      email: "marie@example.com",
      phone: "0612345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un email invalide", () => {
    const result = contactFormSchema.safeParse({
      projectType: "charpente",
      surface: "100",
      deadline: "3-6mois",
      location: "Albi",
      projectDetails: "Description du projet test",
      name: "Jean Dupont",
      email: "pas-un-email",
      phone: "+33612345678",
      message: "Message de test suffisamment long.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) =>
        i.path.includes("email"),
      );
      expect(emailError).toBeDefined();
    }
  });

  it("rejette un type de projet invalide", () => {
    const result = contactFormSchema.safeParse({
      projectType: "plomberie",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const typeError = result.error.issues.find((i) =>
        i.path.includes("projectType"),
      );
      expect(typeError).toBeDefined();
    }
  });

  it("rejette un nom trop court", () => {
    const result = contactFormSchema.safeParse({
      projectType: "couverture",
      name: "J",
      email: "jean@example.com",
      phone: "+33612345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) =>
        i.path.includes("name"),
      );
      expect(nameError).toBeDefined();
    }
  });

  it("rejette une surface negative", () => {
    const result = contactFormSchema.safeParse({
      projectType: "charpente",
      surface: "-50",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
    });
    expect(result.success).toBe(false);
  });

  it("accepte les champs optionnels vides (string vide transforme en undefined)", () => {
    const result = contactFormSchema.safeParse({
      projectType: "mixte",
      projectDetails: "",
      surface: "",
      deadline: "",
      location: "",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
      message: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejette une description de projet trop courte", () => {
    const result = contactFormSchema.safeParse({
      projectType: "charpente",
      projectDetails: "Court",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+33612345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const detailsError = result.error.issues.find((i) =>
        i.path.includes("projectDetails"),
      );
      expect(detailsError).toBeDefined();
    }
  });

  it("rejette un telephone vide", () => {
    const result = contactFormSchema.safeParse({
      projectType: "charpente",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "",
    });
    expect(result.success).toBe(false);
  });
});
