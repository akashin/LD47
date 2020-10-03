#!/bin/bash

cd assets
convert original/station.png -resize 128x128 pack/station.png
convert original/rails_top_bottom.png -resize 64x64 pack/rails_top_bottom.png
convert original/rails_top_bottom.png -resize 64x64 -rotate 90 pack/rails_left_right.png
convert original/rails_top_right.png -resize 64x64 pack/rails_top_right.png
convert original/rails_top_right.png -resize 64x64 -rotate 90 pack/rails_right_bottom.png
convert original/rails_top_right.png -resize 64x64 -rotate 180 pack/rails_bottom_left.png
convert original/rails_top_right.png -resize 64x64 -rotate 270 pack/rails_left_top.png
convert original/blank.png -resize 64x64 pack/blank.png
convert original/blank.png -resize 64x64 pack/blank.png
