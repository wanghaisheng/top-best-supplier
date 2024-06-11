export const templates = {
  subject: "Hello {name}",
  body: "Welcome to {siteName}",
};

export const placeholders = {
  "{year}": new Date().getFullYear(),
  "{siteName}": "top.com",
  "{phone}": "+2348164614193",
};

export function replaceTemplateVars(str, vars) {
  let output = str;

  Object.keys(vars).forEach((key) => {
    output = output.replace(new RegExp(`{${key}}`, "g"), vars[key]);
  });

  return output;
}
