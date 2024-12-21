import numpy as np
import torch
from sklearn.cluster import KMeans
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2 import model_zoo

class DominantColorModel:
    def __init__(self, n_clusters=4, threshold=0.5, device=None):
        self.n_clusters = n_clusters
        self.threshold = threshold
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.predictor = self.setup_mask_rcnn()

    def setup_mask_rcnn(self):
        cfg = get_cfg()
        cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
        cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = self.threshold  # Set threshold for person detection
        cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
        cfg.MODEL.DEVICE = self.device  # Use GPU if available
        return DefaultPredictor(cfg)

    def get_person_mask(self, image):
        outputs = self.predictor(image)
        masks = outputs["instances"].pred_masks.cpu().numpy()
        classes = outputs["instances"].pred_classes.cpu().numpy()
        person_class_id = 0  # Class ID for 'person' in COCO dataset
        person_masks = masks[classes == person_class_id]
        
        if len(person_masks) == 0:
            raise Exception("No person detected in the image.")
        
        return person_masks[0]

    def extract_person_pixels(self, image, mask):
        return image[mask]

    def get_dominant_color_from_person(self, image):
        mask = self.get_person_mask(image)
        person_pixels = self.extract_person_pixels(image, mask)

        if person_pixels.size == 0:
            raise Exception("No person pixels found.")
        
        person_pixels = person_pixels.reshape((-1, 3))  # Reshape to list of pixels (R, G, B)
        
        # Apply K-Means clustering
        kmeans = KMeans(n_clusters=self.n_clusters)
        kmeans.fit(person_pixels)
        
        # Get the dominant color (cluster center with most points)
        unique, counts = np.unique(kmeans.labels_, return_counts=True)
        dominant_color_index = unique[np.argmax(counts)]
        dominant_color = kmeans.cluster_centers_[dominant_color_index]
        
        return dominant_color.astype(int)  # Return as RGB integer values
