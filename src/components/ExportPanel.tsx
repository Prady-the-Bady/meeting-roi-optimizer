
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Table, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeetingData {
  title: string;
  type: string;
  duration: number;
  participants: number;
  totalCost: number;
  costMethod: string;
  timestamp: Date;
}

interface ExportPanelProps {
  meetingData: MeetingData;
}

const ExportPanel = ({ meetingData }: ExportPanelProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      const content = generateReportContent();
      downloadFile(content, `meeting-report-${Date.now()}.txt`, 'text/plain');
      setIsExporting(false);
      toast({
        title: "Report Exported",
        description: "Meeting report has been downloaded successfully.",
      });
    }, 1000);
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    
    setTimeout(() => {
      const csvContent = generateCSVContent();
      downloadFile(csvContent, `meeting-data-${Date.now()}.csv`, 'text/csv');
      setIsExporting(false);
      toast({
        title: "Data Exported",
        description: "Meeting data has been exported to CSV.",
      });
    }, 1000);
  };

  const generateReportContent = () => {
    return `
MEETING COST REPORT
==================

Meeting Details:
- Title: ${meetingData.title}
- Type: ${meetingData.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
- Date: ${meetingData.timestamp.toLocaleDateString()}
- Duration: ${formatTime(meetingData.duration)}
- Participants: ${meetingData.participants}

Cost Analysis:
- Total Cost: ${formatCurrency(meetingData.totalCost)}
- Cost per Participant: ${formatCurrency(meetingData.totalCost / Math.max(meetingData.participants, 1))}
- Cost per Minute: ${formatCurrency(meetingData.totalCost / Math.max(meetingData.duration / 60, 1))}
- Cost Calculation Method: ${meetingData.costMethod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}

Recommendations:
${meetingData.totalCost > 500 ? '- High-cost meeting: Consider reducing participants or duration\n' : ''}${meetingData.duration > 3600 ? '- Long meeting: Consider breaking into smaller sessions\n' : ''}${meetingData.participants > 8 ? '- Large group: Evaluate attendee necessity\n' : ''}${meetingData.totalCost <= 200 && meetingData.duration > 0 ? '- Meeting cost is within optimal parameters\n' : ''}

Generated by MeetingROI Pro
    `.trim();
  };

  const generateCSVContent = () => {
    const headers = ['Title', 'Type', 'Date', 'Duration (minutes)', 'Participants', 'Total Cost', 'Cost per Participant', 'Cost per Minute'];
    const data = [
      meetingData.title,
      meetingData.type,
      meetingData.timestamp.toLocaleDateString(),
      (meetingData.duration / 60).toFixed(2),
      meetingData.participants.toString(),
      meetingData.totalCost.toFixed(2),
      (meetingData.totalCost / Math.max(meetingData.participants, 1)).toFixed(2),
      (meetingData.totalCost / Math.max(meetingData.duration / 60, 1)).toFixed(2)
    ];
    
    return headers.join(',') + '\n' + data.join(',');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: `Meeting Report: ${meetingData.title}`,
        text: `Meeting cost: ${formatCurrency(meetingData.totalCost)} for ${formatTime(meetingData.duration)} with ${meetingData.participants} participants`,
      });
    } else {
      // Fallback to copying to clipboard
      const shareText = `Meeting "${meetingData.title}" cost ${formatCurrency(meetingData.totalCost)} for ${formatTime(meetingData.duration)} with ${meetingData.participants} participants`;
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Meeting summary has been copied to your clipboard.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 mr-2 text-blue-600" />
          Export & Share
        </CardTitle>
        <CardDescription>
          Export meeting data and share insights with your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            onClick={exportToPDF}
            disabled={isExporting || meetingData.duration === 0}
            variant="outline"
            className="flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button 
            onClick={exportToCSV}
            disabled={isExporting || meetingData.duration === 0}
            variant="outline"
            className="flex items-center"
          >
            <Table className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button 
            onClick={shareReport}
            disabled={meetingData.duration === 0}
            variant="outline"
            className="flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Share Report
          </Button>
          
          <Button 
            disabled={meetingData.duration === 0}
            variant="outline"
            className="flex items-center opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            API Export
            <span className="ml-1 text-xs">(Pro)</span>
          </Button>
        </div>
        
        {meetingData.duration > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Meeting: {meetingData.title || "Untitled Meeting"}</p>
              <p>Duration: {formatTime(meetingData.duration)} with {meetingData.participants} participants</p>
              <p>Total Cost: {formatCurrency(meetingData.totalCost)}</p>
              <p>Cost Efficiency: {meetingData.totalCost > 300 ? "High cost - review necessity" : "Within normal range"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
