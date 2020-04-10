import React from "react";
import "./ExploreContainer.css";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonCol,
  IonRow,
  IonImg,
} from "@ionic/react";
import {
  share,
  imageOutline,
  searchOutline,
  albumsOutline,
} from "ionicons/icons";
import { KURATE_URLS } from "../url";

interface ContainerProps {
  name: string;
}

// TODO: TEST DATA, FETCH FROM BACKEND INSTEAD
const items = [
  {
    id: "id1",
    name: "A day in the sky",
    src:
      "https://images.pexels.com/photos/682406/pexels-photo-682406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    date: new Date("2020-01-01"),
  },
  {
    id: "id2",
    name: "A hoe in the garden",
    src:
      "https://images.pexels.com/photos/3584430/pexels-photo-3584430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    date: new Date("2020-01-01"),
  },
  {
    id: "id3",
    name: "A walk in the park",
    src:
      "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    date: new Date("2020-01-01"),
  },
  {
    id: "id4",
    name: "A walk in the park",
    src:
      "https://images.pexels.com/photos/3820994/pexels-photo-3820994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    date: new Date("2020-01-01"),
  },
];

const ExploreContainer: React.FC<ContainerProps> = () => {
  // TODO: Allow configureable multi column layout
  const albums = items.map((item, index) => {
    return (
      <IonRow key={index}>
        <IonCol>
          <IonCard routerLink={KURATE_URLS.Album(item.id)}>
            <IonImg
              src={item.src}
              onIonError={(e) => console.log(e)}
              onIonImgDidLoad={(e) => console.log(e)}
            />
            <IonCardHeader>
              <IonCardSubtitle>
                From {item.date.toLocaleDateString()}
              </IonCardSubtitle>
              <IonCardTitle>{item.name}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </IonCol>
      </IonRow>
    );
  });

  return (
    <IonContent id='albums-content' fullscreen>
      <IonGrid>{albums}</IonGrid>

      <IonFab vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton>
          <IonIcon icon={share} />
        </IonFabButton>
        <IonFabList side='start'>
          <IonFabButton>
            <IonIcon icon={albumsOutline} />
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={imageOutline} />
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={searchOutline} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonContent>
  );
};

export default ExploreContainer;
