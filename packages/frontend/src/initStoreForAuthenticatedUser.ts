import { feathersClient } from './feathersClient';
import type { AppDispatch } from './redux/store';
import type * as reduxShape from './redux';

export const initUserRelatedPartOfStore = async (dispatch: AppDispatch, redux: typeof reduxShape) => {

  const [agendaTemplates] = await Promise.all([
    feathersClient.service('agendaTemplates').find({
      query: {
        $sort: {
          createdAt: -1,
        },
        $limit: -1,
      },
    }),
  ]);

  // dispatch(redux.storeParts.agendaTemplates.set(agendaTemplates));
};
