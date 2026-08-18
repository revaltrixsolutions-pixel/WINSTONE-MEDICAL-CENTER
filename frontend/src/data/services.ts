export interface MedicalService {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  icon: string;
  imageUrl?: string;
  imageUrls?: string[];
  active: boolean;
}

export const defaultServices: MedicalService[] = [
  {
    id: "general-consultation",
    name: "General Consultation",
    shortDescription: "Professional medical consultation, diagnosis, and treatment for all ages.",
    description:
      "Professional medical consultation, diagnosis, treatment, and health guidance for patients of all ages. Our experienced practitioners provide comprehensive health evaluations and personalized care plans.",
    icon: "Stethoscope",
    imageUrl: "",
    imageUrls: [],
    active: true,
  },
  {
    id: "laboratory-services",
    name: "Laboratory Services",
    shortDescription: "Reliable laboratory testing and diagnostic services.",
    description:
      "Reliable laboratory testing and diagnostic services to support accurate medical assessment. Equipped with modern technology to deliver prompt and precise results.",
    icon: "TestTube",
    imageUrl: "",
    imageUrls: [],
    active: true,
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    shortDescription: "Convenient access to prescribed medicines and professional guidance.",
    description:
      "Convenient access to prescribed medicines and professional guidance on safe medication use. Our pharmacy ensures high-quality pharmaceutical products and expert consultations.",
    icon: "Pill",
    imageUrl: "",
    imageUrls: [],
    active: true,
  },
  {
    id: "maternity-care",
    name: "Maternity Care",
    shortDescription: "Compassionate maternity support through pregnancy and delivery.",
    description:
      "Compassionate maternity services supporting mothers throughout pregnancy, delivery, and postnatal care. Dedicated to ensuring a safe and nurturing journey for mother and child.",
    icon: "Baby",
    imageUrl: "",
    imageUrls: [],
    active: true,
  },
  {
    id: "pediatric-care",
    name: "Pediatric Care",
    shortDescription: "Dedicated healthcare services focused on the wellbeing of children.",
    description:
      "Dedicated healthcare services focused on the wellbeing, growth, and development of children. We offer routine vaccinations, check-ups, and specialized pediatric treatment.",
    icon: "HeartPulse",
    imageUrl: "",
    imageUrls: [],
    active: true,
  },
  {
    id: "emergency-care",
    name: "Emergency Care",
    shortDescription: "Prompt medical attention for urgent illnesses and injuries.",
    description:
      "Prompt medical attention for urgent illnesses, injuries, and other emergency healthcare needs. Available around the clock with a specialized team ready to respond swiftly.",
    icon: "Siren",
    imageUrl: "",
    imageUrls: [],
    active: true,
  },
];

export const SERVICES_STORAGE_KEY = "winston_medical_services";

export function getServices(): MedicalService[] {
  if (typeof window === "undefined") {
    return defaultServices;
  }

  try {
    const saved = localStorage.getItem(SERVICES_STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        SERVICES_STORAGE_KEY,
        JSON.stringify(defaultServices),
      );

      return defaultServices;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return defaultServices;
    }

    // Ensure backwards compatibility and correct array structure for imageUrls
    return parsed.map((service) => ({
      ...service,
      imageUrls: Array.isArray(service.imageUrls)
        ? service.imageUrls
        : service.imageUrl
        ? [service.imageUrl]
        : [],
    }));
  } catch {
    return defaultServices;
  }
}

export function saveServices(services: MedicalService[]) {
  localStorage.setItem(
    SERVICES_STORAGE_KEY,
    JSON.stringify(services),
  );
}

export function resetServices() {
  localStorage.setItem(
    SERVICES_STORAGE_KEY,
    JSON.stringify(defaultServices),
  );
}