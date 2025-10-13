# Python Imports
from typing import Optional
import logging

# Django Imports
from django.conf import settings

# Third Party Imports
import boto3
from botocore.exceptions import ClientError


logger = logging.Logger(__name__)


class S3Service:
    """Service for handling private s3 operations"""

    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    def generate_presigned_url(
        self, s3_key: str, expiration: int = None
    ) -> Optional[str]:
        """Generate a presigned URL for AWS S3 Object

        Args:
        s3_key: S3 Object key (path)
        expiration: URL expiration in seconds (default 1h)

        Returns:
        Presigned URL string or None if error
        """

        if not expiration:
            expiration = settings.AWS_PRESIGNED_URL_EXPIRATION

        try:
            url = self.s3_client.generate_presigned_url(
                "get-object", Params={"Bucket": self.bucket_name, "Key": s3_key}
            )

            return url
        except ClientError as e:
            logger.error(
                f"Error generating a presigned URL for AWS S3 private object: {e}"
            )
            return None

    def delete_file(self, s3_key: str) -> bool:
        """Delete AWS S3 object"""

        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=s3_key)

            logger.info("Deleted file from AWS S3: {s3_key}")
            return True

        except ClientError as e:
            logger.error("Error deleting AWS S3 object: {e}")
            return False
