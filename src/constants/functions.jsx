export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
  }
