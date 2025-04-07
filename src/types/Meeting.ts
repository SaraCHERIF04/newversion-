
export interface Meeting {
  id: string;
  pvNumber: string;
  location: string;
  projectId: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  attendees: Array<{id: string, name: string, avatar: string, role?: string}>;
  documents?: Array<{id: string, title: string, url: string}>;
  status?: 'annulé' | 'terminé' | 'à venir';
  type?: string;
}
