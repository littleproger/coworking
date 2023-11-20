import { Coworking } from '@coworking/common/dist/services/coworking';
import { Message } from '@coworking/common/dist/services/messages';
import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { NotFound, BadRequest } from '@feathersjs/errors';
import { HookContext } from '../../app';
import { Paginated } from '@feathersjs/feathers';

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const appendCoworkingOwnerIdToMessage = async (context:any) => {
  const { coworkingId } = context.data || {};

  // Request a page with no data and extract `page.total`
  const { total, data } = await context.app.service('coworkings').find({
    query: {
      _id: coworkingId,
      $limit: 1,
    },
  }) as Paginated<Coworking>;

  if (!total || !data[0].ownerId) {
    throw new NotFound('Coworking owner not found');
  }

  return { ...context, data: Object.assign({ ownerId: data[0].ownerId }, context.data) };
};

const acceptBookingRequestMessage = async (context:any) => {
  if (!context.data || context.data.status !== 'accepted' ) return ;
  const { coworkingId } = context.data || {};

  if (!coworkingId) return context;

  // Request a page with no data and extract `page.total`
  const res = await context.app.service('orders').create({
    clientId: context.data.clientId,
    coworkingId: context.data.coworkingId,
    ownerId: context.data.ownerId,
    startTime:  context.data.startTime,
    endTime:  context.data.endTime,
  }) as Message;

  console.log(res);
  if (!res || !res.coworkingId) {
    throw new BadRequest('Cannot accept request 6e7ZVBZj');
  }

  return context;
};

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ 
      appendCoworkingOwnerIdToMessage,
      hashPassword('password'),
    ],
    update: [ 
      acceptBookingRequestMessage,
      hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ],
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
