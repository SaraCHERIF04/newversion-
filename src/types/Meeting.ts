
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  pvNumber?: string;
  attendees: string[];
  createdAt: string;
  updatedAt?: string;
  projectId?: string;
  subProjectId?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  documents?: {
    id: string;
    title: string;
    url: string;
  }[];
}
