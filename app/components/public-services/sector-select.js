import Component from '@glimmer/component';

export const mockSectors = [
  { id: '1', name: 'Detailhandel en diensten' },
  {
    id: '2',
    name: 'Horeca',
  },
  {
    id: '3',
    name: 'Ambulante activiteiten',
  },
];

export default class SectorSelect extends Component {
  // TODO: Retrieve the correct data from the backend
  sectors = mockSectors;
}
