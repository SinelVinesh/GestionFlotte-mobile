import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader,IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react"
import React, { useState } from "react"
import { Redirect,useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../data/userSlice";
import './detail.css';
import { selectPlanes } from "../../../data/planeSlice";
import KilometrageList from "../../../components/kilometrages/KilometrageList";
import { Camera, CameraResultType} from '@capacitor/camera'
import { Image } from "../../../models/Image";
import { saveImage } from "../../../data/dataApi";
import { Vehicle } from "../../../models/Vehicle";
const VehicleDetail: React.FC = ({}) => {
    const user = useAppSelector(selectUser)
    const vehicles = useAppSelector(selectPlanes);
    const [image,setImage] = useState<Image | undefined>(undefined);
    const params:any = useParams();
    const id = params.id;
    let vehicle = vehicles?.find((vehicle) => vehicle.id == id)
    useIonViewWillEnter(()=>{
        if(vehicle?.image) {
            setImage(vehicle?.image)
        }
    })
    
    if(!user.isLoggedIn) {
        return <Redirect to={{pathname: "/login"}} />
    }
    const uploadImage = async () => {
        const result = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64
        })
        const imageObject = {id:0,data:result.base64String!,format:result.format};
        setImage(imageObject)
        await saveImage(vehicle as Vehicle,imageObject);
    }
    return (
        <IonPage id="vehicle-detail-page">
            <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/tabs/vehicles"></IonBackButton>
                </IonButtons>
                <IonTitle>Détail du véhicule #{id}</IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Informations générales</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {image &&
                                <img src={`data:image/${image.format};base64,${image.data}`} className="image"/>
                            }
                                <IonRow>
                                    <IonCol><strong>Identifiant: </strong> #{id}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <strong>Immatriculation: </strong> {vehicle?.licensePlate}
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <strong>Date d'expiration de l'assurance: </strong> 2023-09-13
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonButton onClick={uploadImage}>Changer la photo</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Informations sur le kilométrage: </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {vehicle?.kilometrages &&
                                    <KilometrageList kilometrages={vehicle.kilometrages} />
                                }
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default VehicleDetail
