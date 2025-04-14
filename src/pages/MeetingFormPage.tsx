import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Meeting } from '@/types/Meeting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { notifyNewMeeting } from '@/utils/notificationHelpers';

const MeetingFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEditing) {
      // Load existing meeting data
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings = JSON.parse(meetingsString);
          const meeting = meetings.find((m: Meeting) => m.id === id);
          if (meeting) {
            setTitle(meeting.title);
            setDate(meeting.date);
            setTime(meeting.time);
            setLocation(meeting.location);
            setDescription(meeting.description);
          }
        } catch (error) {
          console.error('Error loading meeting data:', error);
        }
      }
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!title.trim() || !date.trim() || !time.trim()) {
      alert("Le titre, la date et l'heure sont obligatoires");
      return;
    }

    // Prepare the meeting data
    const meetingData: Meeting = {
      id: isEditing ? id! : uuidv4(),
      title,
      date,
      time,
      location,
      description
    };

    // Save to localStorage
    const meetingsString = localStorage.getItem('meetings');
    let meetings: Meeting[] = [];

    try {
      if (meetingsString) {
        meetings = JSON.parse(meetingsString);
      }

      if (isEditing) {
        // Update existing meeting
        meetings = meetings.map(m => m.id === id ? meetingData : m);
      } else {
        // Add new meeting to the beginning of the array
        meetings.unshift(meetingData);
      }

      localStorage.setItem('meetings', JSON.stringify(meetings));

      if (!isEditing) {
        // Only notify for new meetings
        notifyNewMeeting(title);
      }

      navigate('/meetings');
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/meetings')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifier' : 'Créer'} Réunion
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="mb-2 block">Titre de la réunion</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entrez le titre"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date" className="mb-2 block">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="time" className="mb-2 block">Heure</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="mb-2 block">Lieu</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Entrez le lieu"
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez la description"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingFormPage;
