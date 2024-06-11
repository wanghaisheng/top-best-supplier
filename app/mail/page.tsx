import { replaceTemplateVars, templates } from "../utils/templates";

export default function Page() {
  const vars = {
    name: "John",
    siteName: "Acme",
  };

  const subject = replaceTemplateVars(templates.subject, vars);
  // "Hello John"

  const body = replaceTemplateVars(templates.body, vars);
  // "Welcome to Acme"

  return (
    <div>
      <h1>{subject}</h1>
      <p>{body}</p>
    </div>
  );
}
