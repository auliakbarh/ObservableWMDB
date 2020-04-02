import {times} from 'rambdax';
import {dummy_title, dummy_detail, dummy_location, dummy_subLocation, dummy_locationDetail} from './randomData';
import {getUNIXTS} from "../UNIXTS";

const makeHazard = (db, i) => {
    const waktuLaporan = getUNIXTS() + i;

    return db.collections.get('hazards').prepareCreate(hazard => {
        // hazard.createdAt = createdAt;
        // hazard._id = _id;
        hazard.waktuLaporan = waktuLaporan;
        hazard.judulHazard = dummy_title[i] || hazard.id;
        hazard.detailLaporan = dummy_detail[i] || hazard.id;
        hazard.lokasi = dummy_location[i] || hazard.id;
        hazard.subLokasi = dummy_subLocation[i] || hazard.id;
        hazard.detailLokasi = dummy_locationDetail[i] || hazard.id;
    })

}

const generate = (db) => {
    try{
        if(db){
            db.action(async action => {
                const hazards = times(i => makeHazard(db, i), 5);
                console.log(hazards.length);
                await db.batch(...hazards)
            });
        }

        return true;
    }catch (e) {
        console.log(e);
        return false
    }
};

export default generate;
