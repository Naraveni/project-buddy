
export default  function formatBlogFilters(formData: FormData) {
  console.log("formData",formData)
  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const status = formData.get("status")?.toString().trim();
  const tags = formData.getAll("tags");

  const params = new URLSearchParams();

  if (title) params.set("title", title.toString());
  if (category) params.set("category", category.toString());
  if (status) params.set("status", status.toString());
  for (const tag of tags) {
    params.append("tags", tag.toString());
  }

  return params;
}