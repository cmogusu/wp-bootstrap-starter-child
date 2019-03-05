export const editMode = /=(.*)/;
export const addCase = /=|(.*)(,|=|\*|&|\/|%|\+|\^|\()/g;
export const replaceCase = /=|(.*)(((([A-Z]{1,})\d{1,}):(([A-Z]{1,})\d{1,}))|(([A-Z]{1,})\d{1,}))/g;
export const selectable = /^=(.*)(,|=|\*|&|\/|%|\+|\*|\^|\(|((([A-Z]{1,})\d{1,}):(([A-Z]{1,})\d{1,}))|(([A-Z]{1,})\d{1,}))/;
export const beforeSelection = /(.*)(=|\*|&|\/|%|\+|\*|\^|\(|(\),))/g;
export const singleSelection = /((([A-Z]{1,})\d{1,}):(([A-Z]{1,})\d{1,}))|(([A-Z]{1,})\d{1,})/g;
