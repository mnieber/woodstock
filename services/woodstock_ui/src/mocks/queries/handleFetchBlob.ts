import { http, HttpResponse } from 'msw';
import { hostUrl } from '/src/api/restClient';
import { fetchBlobUrl } from '/src/api/queries/useFetchBlob';
import { convertDataToSnakeCase } from '/src/api/utils/convertDataToSnakeCase';
import { BlobContentSchema } from '/src/api/types/BlobContentSchema';
import { joinUrls } from '/src/utils/urls';

// Mock blob content based on tree paths
const mockBlobs: { [path: string]: string } = {
  's3://bucket/job-123/calc-456/config.json': JSON.stringify(
    {
      algorithm: 'gradient_descent',
      learning_rate: 0.01,
      max_iterations: 1000,
      convergence_threshold: 0.0001,
    },
    null,
    2
  ),
  's3://bucket/job-123/calc-456/result.json': JSON.stringify(
    {
      final_loss: 0.0023,
      iterations_completed: 847,
      converged: true,
      model_accuracy: 0.9567,
    },
    null,
    2
  ),
};

export const handleFetchBlob = http.get(
  joinUrls(hostUrl, fetchBlobUrl),
  ({ request }) => {
    const url = new URL(request.url);
    const treePath = url.searchParams.get('tree_path');

    if (!treePath) {
      return new HttpResponse('tree_path is required', { status: 400 });
    }

    const content = mockBlobs[treePath];

    if (!content) {
      return new HttpResponse(`Blob not found: ${treePath}`, { status: 404 });
    }

    return HttpResponse.json(
      convertDataToSnakeCase(BlobContentSchema, {
        path: treePath,
        content: content,
      })
    );
  }
);
