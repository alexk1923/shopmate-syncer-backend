class ResourceAlreadyExists extends Error {
    statusCode: number;
    
    constructor(message: string) {
      super(message);
      this.name = "ResourceAlreadyExists";
      this.statusCode = 409;
    }
  }
  
  class BadRequestException extends Error {
    statusCode: number;

    constructor(message: string) {
      super(message);
      this.name = "BadRequestException";
      this.statusCode = 400;
    }
  }

  export {ResourceAlreadyExists, BadRequestException}
  