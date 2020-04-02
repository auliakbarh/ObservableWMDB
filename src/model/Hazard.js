import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Hazard extends Model {
  static table = 'hazards';

  @field('createdAt') createdAt;
  @field('_id') _id;
  @field('waktuLaporan') waktuLaporan;
  @field('judulHazard') judulHazard;
  @field('detailLaporan') detailLaporan;
  @field('lokasi') lokasi;
  @field('subLokasi') subLokasi;
  @field('detailLokasi') detailLokasi;

  getHazard(){
    return {
      'createdAt': this.createdAt,
      '_id': this._id,
      'waktuLaporan': this.waktuLaporan,
      'judulHazard': this.judulHazard,
      'detailLaporan': this.detailLaporan,
      'lokasi': this.lokasi,
      'subLokasi': this.subLokasi,
      'detailLokasi': this.detailLokasi
    }
  }

}
