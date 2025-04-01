
/**
 * Facial Recognition Service
 * Simulates AI-based facial recognition capabilities
 */

export interface FacialSearchResult {
  personId: number;
  personName: string;
  matchConfidence: number;
  timestamp: Date;
  cameraId: number;
  cameraName: string;
  imageUrl: string;
}

export interface FacialSearchQuery {
  personId?: number;
  personName?: string;
  minConfidence?: number;
  startDate?: Date;
  endDate?: Date;
  cameraIds?: number[];
  limit?: number;
}

class FacialRecognitionService {
  /**
   * Search for a person across camera feeds based on facial recognition
   */
  async searchByFace(query: FacialSearchQuery): Promise<FacialSearchResult[]> {
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock results based on the query
    const results: FacialSearchResult[] = [];
    const limit = query.limit || 20;
    const mockPersons = [
      { id: 101, name: 'Arun Kumar' },
      { id: 102, name: 'Priya Sharma' },
      { id: 103, name: 'Raj Patel' },
      { id: 104, name: 'Sunita Gupta' },
      { id: 105, name: 'Vikram Singh' }
    ];
    
    const mockCameras = [
      { id: 1, name: 'Main Entrance' },
      { id: 2, name: 'Class 10A' },
      { id: 3, name: 'Cafeteria' },
      { id: 4, name: 'Playground' },
      { id: 5, name: 'Library' }
    ];
    
    // If searching for a specific person
    let personsToInclude = mockPersons;
    if (query.personId) {
      personsToInclude = mockPersons.filter(p => p.id === query.personId);
    } else if (query.personName) {
      personsToInclude = mockPersons.filter(p => 
        p.name.toLowerCase().includes(query.personName!.toLowerCase())
      );
    }
    
    // Filter cameras if specified
    let camerasToInclude = mockCameras;
    if (query.cameraIds && query.cameraIds.length > 0) {
      camerasToInclude = mockCameras.filter(c => query.cameraIds!.includes(c.id));
    }
    
    // Generate results
    for (let i = 0; i < limit && i < 50; i++) {
      const person = personsToInclude[Math.floor(Math.random() * personsToInclude.length)];
      const camera = camerasToInclude[Math.floor(Math.random() * camerasToInclude.length)];
      
      // Random date in the last month
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
      
      // Apply date filters if specified
      if (query.startDate && pastDate < query.startDate) continue;
      if (query.endDate && pastDate > query.endDate) continue;
      
      const confidence = 0.7 + Math.random() * 0.3; // 70%-100% confidence
      
      // Apply confidence filter if specified
      if (query.minConfidence && confidence < query.minConfidence) continue;
      
      results.push({
        personId: person.id,
        personName: person.name,
        matchConfidence: confidence,
        timestamp: pastDate,
        cameraId: camera.id,
        cameraName: camera.name,
        imageUrl: `https://picsum.photos/seed/${person.id + i}/100/100?grayscale`
      });
    }
    
    // Sort by timestamp (most recent first)
    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  /**
   * Train the facial recognition model with a new person
   */
  async trainModel(personId: number, personName: string, imageUrls: string[]): Promise<boolean> {
    // Simulate training delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, this would:
    // 1. Process the training images to extract facial features
    // 2. Generate embeddings using a deep learning model
    // 3. Store the embeddings in a vector database
    
    console.log(`Trained model for ${personName} (ID: ${personId}) with ${imageUrls.length} images`);
    return true;
  }
  
  /**
   * Detect faces in an image and return bounding boxes
   */
  async detectFaces(imageUrl: string): Promise<{x: number, y: number, width: number, height: number}[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate between 0 and 5 random face detections
    const faceCount = Math.floor(Math.random() * 6);
    const faces = [];
    
    for (let i = 0; i < faceCount; i++) {
      faces.push({
        x: Math.random() * 0.6 + 0.2, // 20% to 80% of image width
        y: Math.random() * 0.6 + 0.2, // 20% to 80% of image height
        width: Math.random() * 0.2 + 0.1, // 10% to 30% of image width
        height: Math.random() * 0.2 + 0.1 // 10% to 30% of image height
      });
    }
    
    return faces;
  }
}

export const facialRecognitionService = new FacialRecognitionService();
