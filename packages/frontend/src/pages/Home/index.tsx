import React from 'react';

import SolidButton from '../../components/SolidButton';
import PlaceCard from '../../components/PlaceCard';
import './landing-page.css';
import { useCallback } from 'react';
import { feathersClient } from '../../feathersClient';
import { useAppSelector } from '../../redux/hooks';
import * as redux from '../../redux';
import { useQuery } from '../../customHooks/useQuery';
import { Coworking } from '@coworking/common/dist/services/coworking';

export const Home = () => {
  const user = useAppSelector(redux.storeParts.user.getData);

  const getCoworkings = useCallback(async ()=> {
    const response = await feathersClient.service('coworkings').find();

    if (!response.data.length) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  }, [user?._id]);

  const { data, error, isLoading, refetch } = useQuery<Coworking>(getCoworkings);

  return (
    <div className="landing-page-container">
      <div className="landing-page-top-container">
        <div className="landing-page-hero">
          <div className="landing-page-content-container">
            <h1 className="Heading landing-page-text12">Book an exclusive</h1>
            <h2 className="Subheading landing-page-subheading">
              place for your work
            </h2>
            <span className="landing-page-text13">
              <span>
                Where Innovation Meets Collaboration
              </span>
            </span>
            <SolidButton>Explore coworkings</SolidButton>
          </div>
        </div>
      </div>
      <div id="main-section" className="landing-page-main">
        <h1>
          <span>Most famous coworkings</span>
          <br></br>
        </h1>
        <span className="landing-page-text20">Recommended</span>
        <div className="landing-page-cards-container">
          {data?.map(coworking=>(
            <PlaceCard
              key={coworking._id}
              {...coworking}
              city={coworking.location}
              image={coworking.mainImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
