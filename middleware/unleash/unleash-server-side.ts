const useServerSideFlags = (context: any, key: string): boolean => {
  if (
    context &&
    context.req &&
    context.req.context &&
    context.req.context.unleash
  ) {
    return context.req.context.unleash.isEnabled(key);
  } else {
    return false;
  }
};

export default useServerSideFlags;
