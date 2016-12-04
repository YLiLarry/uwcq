{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DuplicateRecordFields #-}

import Data.Aeson as A
import Network.JSONApi as J hiding (id)
import GHC.Generics
import Data.Text (Text)
import qualified Data.Text as T
import Data.ByteString.Lazy as B (ByteString)
import qualified Data.ByteString.Lazy as B
import Data.Maybe
import Data.HashMap.Strict
import Text.Printf
import Prelude hiding (id)
import TextShow
import Data.Extend

data InputCourse = InputCourse {
      course_id      :: Maybe Text
    , subject        :: Maybe Text
    , catalog_number :: Maybe Text
    , title          :: Maybe Text
} deriving (Generic, Show)

instance FromJSON InputCourse

data OutputCourse = OutputCourse {
      id      :: Text
    , subject :: Text
    , number  :: Text
    , title   :: Text
} deriving (Generic, Show)

instance ToJSON OutputCourse
instance FromJSON OutputCourse

parseInput :: ByteString -> [InputCourse]
parseInput str = 
  case fromJSON $ findData $ fromJust $ decode str of
      Success a -> a
      A.Error e -> error $ printf "could not parse: %v..." (take 100 $ show str)
    where 
      findData :: HashMap Text Value -> Value
      findData m = m ! "data"

outputCourse :: InputCourse -> OutputCourse
outputCourse a = 
    OutputCourse {
        id = fromJust $ course_id a
      , subject = fromJust $ subject (a :: InputCourse)
      , number = fromJust $ catalog_number a
      , title = fromJust $ title (a :: InputCourse)
    }

instance ResourcefulEntity OutputCourse where
    resourceIdentifier a = id a
    resourceType = const "course"
    resourceLinks = const Nothing
    resourceMetaData = const Nothing
    resourceRelationships = const Nothing

outputDocument :: [InputCourse] -> Document OutputCourse
outputDocument cs = mkDocument resc Nothing Nothing 
    where
        resc = zipWith convert cs [1..length cs]
        convert :: InputCourse -> Int -> OutputCourse
        convert c i = (outputCourse c){id = showt i}


main :: IO ()
main = do
    txt <- B.getContents
    B.putStr $ encode $ outputDocument $ parseInput txt
    
    
    