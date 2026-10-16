import { IRecipe } from "@/features/recipes/recipes.types";
import { ScrollView, useWindowDimensions } from "react-native";
import RecipeSlide from "./recipe-slide";

// Matches the Log Food page's side padding, so the first card lines up with
// the headings while the row itself runs edge to edge.
const PAGE_PADDING = 16;
const GAP = 12;

interface IProps {
  recipes: IRecipe[];
  onPress: (recipe: IRecipe) => void;
}

// Width of one card: most of the screen, so the next one peeks in.
export const getSlideWidth = (windowWidth: number) =>
  Math.min(280, Math.round(windowWidth * 0.66));

// Native horizontal scroll with snapping: the scroll runs on the native side
// (smooth even when JS is busy), each swipe moves exactly one card, and it
// settles quickly on a card's edge.
export default function RecipeCarousel({ recipes, onPress }: IProps) {
  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = getSlideWidth(windowWidth);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={slideWidth + GAP}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      // Bleed past the page padding, then pad the content back in.
      style={{ marginHorizontal: -PAGE_PADDING }}
      contentContainerStyle={{ paddingHorizontal: PAGE_PADDING, gap: GAP }}
    >
      {recipes.map((recipe) => (
        <RecipeSlide
          key={recipe.id}
          recipe={recipe}
          width={slideWidth}
          onPress={onPress}
        />
      ))}
    </ScrollView>
  );
}
