const slugify = (str, maxLen) => (
  str.toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
    .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
    .substring(str, maxLen)   //position is correct to remove trailing "-"
    .replace(/^-+|-+$/g, '') // remove leading, trailing -
)

module.exports = slugify
