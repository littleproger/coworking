import { useState } from 'react';
import { Coworking } from '@coworking/common/dist/services/coworking';
import { Order } from '@coworking/common/dist/services/orders';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/react';
import { useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import { useQuery } from '../../customHooks/useQuery';
import { feathersClient, feathersSocketClient } from '../../feathersClient';
import * as redux from '../../redux';
import { useAppSelector } from '../../redux/hooks';
import { EventContentArg, EventHoveringArg } from '@fullcalendar/core';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

type OrdersModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  coworkingId: string;
}

export const OrdersModal = (props: OrdersModalProps) => {
  const { isOpen, onRequestClose, coworkingId } = props;
  const [openTooltipInfo, setOpenTooltipInfo] = useState<any>(null);
  const user = useAppSelector(redux.storeParts.user.getData);

  const getOrders = useCallback(async () => {
    const response = await feathersClient.service('orders').find({
      query: {
        ownerId: user?._id,
        coworkingId,
      },
    });

    if (!response.data.length) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  }, [user?._id, coworkingId]);

  const { data: orders, error: ordersError, isLoading: ordersIsLoading, refetch: refetchOrders } = useQuery<Order>(getOrders);

  useEffect(() => {
    feathersSocketClient.service('orders').on('created', (message: any) => {
      refetchOrders();
    })
  }, [feathersSocketClient]);

  const modifiedOrders = orders?.map(order => {
    return {
      ...order,
      start: new Date(order.startTime),
      end: new Date(order.endTime),
      title: `${order.client.name} (${order.client.phone || order.client.email})`,
    }
  })

  const businessHours = [ // specify an array instead
    {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '08:00', // 8am
      endTime: '20:00', // 6pm
    },
    {
      daysOfWeek: [6, 7],
      startTime: '10:00', // 10am
      endTime: '18:00', // 4pm
    },
  ];

  const handleMouseLeaveEvent = ({ event }: EventHoveringArg) => {
    setOpenTooltipInfo(event)
  }
  const handleMouseEnterEvent = ({ }: EventHoveringArg) => {
    setOpenTooltipInfo(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Information Entry"
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      style={{
        overlay: {
          zIndex: 99,
        },
        content: {
          inset: '70px',
        },
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay', // user can switch between the two
        }}
        views={{
          timeGridFourDay: {
            type: 'timeGrid',
            duration: { days: 7 },
          },
        }}
        events={modifiedOrders}
        eventMouseLeave={handleMouseLeaveEvent}
        eventMouseEnter={handleMouseEnterEvent}
        eventContent={(eventInfo:EventContentArg) => (
          <Tooltip
            arrow
            placement={eventInfo.view.type === 'timeGridDay' ? 'top-start' : 'top'}
            style={{
              width:'100%', height: '100%', display: 'flex', alignItems: eventInfo.view.type === 'timeGridWeek' ? 'flex-start' : 'center',
              flexDirection: eventInfo.view.type === 'timeGridWeek' ? 'column' : 'row',
              gap: 2,
            }}
            title={
              <Stack>
                <Typography>
                  <strong>Coworking:</strong> {eventInfo.event.extendedProps['coworking']['title']}
                </Typography>
                <Typography>
                  <strong>Client name:</strong> {eventInfo.event.extendedProps['client']['name']}
                </Typography>
                <Typography>
                  <strong>Client contacts:</strong>
                  <br />
                  Phone: {eventInfo.event.extendedProps['client']['phone']}
                  Email: {eventInfo.event.extendedProps['client']['email']}
                </Typography>
              </Stack>
            }
          >
            <div>
              <div className="fc-daygrid-event-dot" />
              <div className="fc-event-time">{eventInfo.timeText}</div>
              <div className="fc-event-title">{eventInfo.event.title}</div>
            </div>
          </Tooltip>
        )}
        businessHours={businessHours}
        height="100%"
      />
    </Modal>
  )
}