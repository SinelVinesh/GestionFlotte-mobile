import React, { useState, useRef, useEffect } from 'react';

import { IonToolbar, IonContent, IonPage, IonButtons, IonTitle, IonMenuButton, IonSegment, IonSegmentButton, IonButton, IonIcon, IonSearchbar, IonRefresher, IonRefresherContent, IonToast, IonModal, IonHeader, getConfig, IonLoading, useIonViewWillEnter } from '@ionic/react';
import { options, search } from 'ionicons/icons';

import './VehiclesListPage.scss'


import VehicleList from '../../../components/vehicles/VehicleList';
import { getVehicles } from '../../../data/dataApi';
import { Vehicle } from '../../../models/Vehicle';
import { useDispatch } from 'react-redux';
import { selectPlanes, setPlanes } from '../../../data/planeSlice';
import { useAppSelector } from '../../../app/hooks';

const VehicleListPage: React.FC = () => {
  const dispatch = useDispatch();
  const vehicles = useAppSelector(selectPlanes)
  const [showSearchbar, setShowSearchbar] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const [showCompleteToast, setShowCompleteToast] = useState(false);
  const mode = getConfig()!.get('mode');
  const pageRef = useRef<HTMLElement>(null);

  useIonViewWillEnter(() => {
    if(!vehicles) {
      getVehicles().then((data) => {
      
        dispatch(setPlanes(data));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  },[vehicles])
  const ios = mode === 'ios';
  
  const doRefresh = () => {
    getVehicles().then((data) => {
      dispatch(setPlanes(data));
      setLoading(false);
    });
    setTimeout(() => {
      ionRefresherRef.current!.complete();
      setShowCompleteToast(true);
    }, 2500)
  };

  return (
    <IonPage ref={pageRef} id="schedule-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          {!showSearchbar &&
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          }
          {!ios && !showSearchbar &&
            <IonTitle>Vehicules</IonTitle>
          }

          <IonButtons slot="end">
            {!ios && !showSearchbar &&
              <IonButton onClick={() => setShowSearchbar(true)}>
                <IonIcon slot="icon-only" icon={search}></IonIcon>
              </IonButton>
            }
            {!showSearchbar &&
              <IonButton onClick={() => setShowFilterModal(true)}>
                {mode === 'ios' ? 'Filter' : <IonIcon icon={options} slot="icon-only" />}
              </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Vehicules</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" ref={ionRefresherRef} onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonToast
          isOpen={showCompleteToast}
          message="Refresh complete"
          duration={2000}
          onDidDismiss={() => setShowCompleteToast(false)}
        />
        { loading &&
          <h1>Chargement...</h1>
        }
        {/* { error &&
          <h1>Une erreur est survenue : {error?.message}</h1>
        } */}
        { vehicles &&
          <VehicleList
            vehicles={vehicles!}
          />
        }
      </IonContent>

    </IonPage>
  );
};

export default React.memo(VehicleListPage);
