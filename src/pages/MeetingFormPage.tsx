import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Meeting } from '@/types/Meeting';
import { Project } from '@/components/ProjectCard';

type ProjectMember = {
  id: string;
  name: string;
  avatar: string;
  role?: string;
};

type CustomAttendee = {
  id: string;
  name: string;
  role?: string;
};

const MeetingFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [pvNumber, setPvNumber] = useState('');
  const [location, setLocation] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [description, setDescription] = useState('');
  const [attendees, setAttendees] = useState<ProjectMember[]>([]);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [customAttendees, setCustomAttendees] = useState<CustomAttendee[]>([]);
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [newAttendeeRole, setNewAttendeeRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Array<{id: string, title: string, url: string}>>([]);
  const [status, setStatus] = useState<'annulé' | 'terminé' | 'à venir'>('à venir');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableMembers, setAvailableMembers] = useState<ProjectMember[]>([]);
  
  useEffect(() => {
    // Load projects
    const projectsString = localStorage.getItem('projects');
    if (projectsString) {
      try {
        const projectsList = JSON.parse(projectsString);
        setProjects(projectsList);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
    
    // If editing, load meeting data
    if (isEdit && id) {
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings = JSON.parse(meetingsString);
          const meeting = meetings.find((m: Meeting) => m.id === id);
          if (meeting) {
            setPvNumber(meeting.pvNumber);
            setLocation(meeting.location);
            setProjectId(meeting.projectId);
            setDate(meeting.date);
            setStartTime(meeting.startTime);
            setEndTime(meeting.endTime);
            setDescription(meeting.description);
            setAttendees(meeting.attendees || []);
            setSelectedAttendees(meeting.attendees.map((a: any) => a.id));
            setDocuments(meeting.documents || []);
            setStatus(meeting.status || 'à venir');
            
            // Separate project members from custom attendees
            const projectMembers = meeting.attendees.filter((a: any) => a.id.startsWith('member-'));
            const custom = meeting.attendees.filter((a: any) => !a.id.startsWith('member-'));
            if (custom.length > 0) {
              setCustomAttendees(custom);
            }
          }
        } catch (error) {
          console.error('Error loading meeting:', error);
        }
      }
    }
  }, [id, isEdit]);
  
  useEffect(() => {
    if (projectId) {
      // Get members from the selected project
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        try {
          const projects = JSON.parse(projectsString);
          const project = projects.find((p: Project) => p.id === projectId);
          if (project && project.members) {
            setAvailableMembers(project.members.map((member: any) => ({
              id: member.id,
              name: member.name,
              avatar: member.avatar,
              role: member.role
            })));
          } else {
            setAvailableMembers([]);
          }
        } catch (error) {
          console.error('Error getting project members:', error);
          setAvailableMembers([]);
        }
      }
    } else {
      setAvailableMembers([]);
    }
  }, [projectId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleAttendeeToggle = (memberId: string) => {
    setSelectedAttendees(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };
  
  const addCustomAttendee = () => {
    if (newAttendeeName.trim()) {
      const newAttendee: CustomAttendee = {
        id: `custom-${Date.now()}`,
        name: newAttendeeName.trim(),
        role: newAttendeeRole.trim() || undefined
      };
      
      setCustomAttendees(prev => [...prev, newAttendee]);
      setNewAttendeeName('');
      setNewAttendeeRole('');
    }
  };
  
  const removeCustomAttendee = (id: string) => {
    setCustomAttendees(prev => prev.filter(attendee => attendee.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a URL for the file (in a real app, this would upload to a server)
    let documentsList = [...documents];
    if (file) {
      // In a real app, upload the file to a server
      // For now, we'll just create a fake URL
      documentsList.push({
        id: `doc-${Date.now()}`,
        title: file.name,
        url: `/documents/${file.name}`
      });
    }
    
    // Get selected attendees from available members
    const selectedAttendeesList = availableMembers.filter(member => 
      selectedAttendees.includes(member.id)
    );
    
    // Combine project members and custom attendees
    const allAttendees = [
      ...selectedAttendeesList,
      ...customAttendees.map(attendee => ({
        id: attendee.id,
        name: attendee.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=random`,
        role: attendee.role
      }))
    ];
    
    const meetingData: Meeting = {
      id: id || `meeting-${Date.now()}`,
      pvNumber,
      location,
      projectId,
      date,
      startTime,
      endTime,
      description,
      attendees: allAttendees,
      documents: documentsList,
      status
    };
    
    // Save meeting to localStorage
    const meetingsString = localStorage.getItem('meetings');
    let meetings: Meeting[] = [];
    
    if (meetingsString) {
      try {
        meetings = JSON.parse(meetingsString);
        
        if (isEdit) {
          // Update existing meeting
          meetings = meetings.map(meeting => meeting.id === id ? meetingData : meeting);
        } else {
          // Add new meeting
          meetings.push(meetingData);
        }
      } catch (error) {
        console.error('Error parsing meetings:', error);
        if (!isEdit) {
          meetings = [meetingData];
        }
      }
    } else {
      meetings = [meetingData];
    }
    
    localStorage.setItem('meetings', JSON.stringify(meetings));
    
    navigate('/reunion');
  };
  
  const handleDelete = () => {
    if (isEdit && window.confirm('Êtes-vous sûr de vouloir supprimer cette réunion?')) {
      try {
        const meetingsString = localStorage.getItem('meetings');
        if (meetingsString) {
          const meetings = JSON.parse(meetingsString);
          const updatedMeetings = meetings.filter((meeting: Meeting) => meeting.id !== id);
          localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
          navigate('/reunion');
        }
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/reunion')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux réunions</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">
        {isEdit ? 'Modifier' : 'Créer'} Réunion
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="pvNumber" className="mb-2 block">Numéro du PV réunion</Label>
              <Input
                id="pvNumber"
                value={pvNumber}
                onChange={(e) => setPvNumber(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="mb-2 block">Lieu du réunion</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="project" className="mb-2 block">Projet associé</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="sélectionnez un projet" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date" className="mb-2 block">Date réunion</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="startTime" className="mb-2 block">Heure de début</Label>
              <div className="flex items-center">
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endTime" className="mb-2 block">Heure de fin</Label>
              <div className="flex items-center">
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="description" className="mb-2 block">Description du Réunion</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="mb-6">
            <Label className="mb-2 block">Ajouter des assistants externes</Label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
              <div className="md:col-span-2">
                <Input
                  placeholder="Nom"
                  value={newAttendeeName}
                  onChange={(e) => setNewAttendeeName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  placeholder="Rôle/Fonction"
                  value={newAttendeeRole}
                  onChange={(e) => setNewAttendeeRole(e.target.value)}
                />
              </div>
              <div>
                <Button 
                  type="button" 
                  onClick={addCustomAttendee}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {customAttendees.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium mb-2">Assistants ajoutés:</p>
                <div className="space-y-2">
                  {customAttendees.map(attendee => (
                    <div key={attendee.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div>
                        <span className="font-medium">{attendee.name}</span>
                        {attendee.role && <span className="text-xs text-gray-500 ml-2">({attendee.role})</span>}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeCustomAttendee(attendee.id)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {projectId && (
            <div className="mb-6">
              <Label className="mb-2 block">Ajouter les membres présents</Label>
              <div className="border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto">
                {availableMembers.length > 0 ? (
                  availableMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedAttendees.includes(member.id)}
                        onCheckedChange={() => handleAttendeeToggle(member.id)}
                      />
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="h-8 w-8 rounded-full"
                      />
                      <label 
                        htmlFor={`member-${member.id}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        {member.name}
                        {member.role && <span className="text-xs text-gray-500 ml-1">({member.role})</span>}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    Aucun membre disponible. Veuillez sélectionner un projet.
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <Label htmlFor="status" className="mb-2 block">Statut</Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as 'annulé' | 'terminé' | 'à venir')}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="à venir">À venir</SelectItem>
                <SelectItem value="terminé">Terminé</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-8">
            <Label htmlFor="file" className="mb-2 block">Télécharger document</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center"
                onClick={() => document.getElementById('file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger document
              </Button>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && <span className="text-sm text-gray-600">{file.name}</span>}
            </div>
            
            {documents.length > 0 && (
              <div className="mt-4">
                <Label className="mb-2 block">Documents existants</Label>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="p-2 bg-blue-50 text-blue-600 rounded-md flex justify-between items-center">
                      <span>{doc.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            {isEdit && (
              <Button 
                type="button" 
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleDelete}
              >
                Supprimer
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingFormPage;
