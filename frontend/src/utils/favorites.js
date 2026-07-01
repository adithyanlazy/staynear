// Favorites may arrive as plain ids or as populated objects
// ({ pgId }, { pgId: { _id } }, or the PG document itself) depending on the endpoint.
export const isPGFavorite = (user, pgId) =>
  Boolean(
    user?.favorites?.some(fav => {
      if (typeof fav === 'object' && fav !== null) {
        return (fav.pgId?._id || fav.pgId || fav._id) === pgId;
      }
      return fav === pgId;
    })
  );
