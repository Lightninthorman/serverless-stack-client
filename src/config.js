export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_LfT7ZA79i1SjPkobRXdVaOqL004bXc4UPT",
  s3: {
    REGION: "us-east-1",
    BUCKET: "thor-notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://2sdl1m0nj9.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_yTeqUShDJ",
    APP_CLIENT_ID: "6tdug74qn2uhf84kgac05hfnqk",
    IDENTITY_POOL_ID: "us-east-1:ae4ff3b5-3b8d-42da-a12d-3e6a8378ae37"
  }
};
