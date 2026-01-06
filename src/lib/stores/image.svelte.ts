export const expandedImage = $state<{ value: string }>({ value: "" });

export const expandImage = (msgId: string) => (expandedImage.value = msgId);

export const closeExpandedImage = () => {
  const hasExpandedImage = !!expandedImage.value;
  expandedImage.value = "";
  return hasExpandedImage;
};
