#!/bin/bash

cd assets
convert original/station.png -resize 32x32 pack/station.png
convert original/factory.png -resize 32x32 pack/factory.png
convert original/factory_no_base.png -resize 32x32 pack/factory_no_base.png
convert original/rails_top_bottom.png -resize 32x32 pack/rails_top_bottom.png
convert original/rails_top_bottom.png -resize 32x32 -rotate 90 pack/rails_left_right.png
convert original/rails_top_right.png -resize 32x32 pack/rails_top_right.png
convert original/rails_top_right.png -resize 32x32 -rotate 90 pack/rails_right_bottom.png
convert original/rails_top_right.png -resize 32x32 -rotate 180 pack/rails_bottom_left.png
convert original/rails_top_right.png -resize 32x32 -rotate 270 pack/rails_left_top.png
convert original/blank.png -resize 32x32 pack/blank.png
convert original/blank.png -resize 32x32 pack/blank_1.png
convert original/blank.png -resize 32x32 pack/blank_2.png
convert original/blank.png -resize 32x32 pack/blank_3.png
convert original/blank.png -resize 32x32 pack/blank_4.png
