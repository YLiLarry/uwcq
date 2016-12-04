{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DuplicateRecordFields #-}

import Data.Aeson as A
import Data.Aeson.Types as A
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
import Data.Char as C

data Course = Course {
      academic_level           :: Maybe Text
    , antirequisites           :: Maybe Text
    , calendar_year            :: Maybe Text
    , catalog_number           :: Maybe Text
    , corequisites             :: Maybe Text
    , course_id                :: Maybe Text
    , crosslistings            :: Maybe Text
    , description              :: Maybe Text
    -- , extra                    :: Maybe Text
    , instructions             :: Maybe [Text]
    , needs_department_consent :: Maybe Bool
    , needs_instructor_consent :: Maybe Bool
    , notes                    :: Maybe Text
    -- , offerings                :: Maybe [Text]
    -- , conrad_grebel            :: Maybe Bool
    -- , conrad_grebel_only       :: Maybe Bool
    -- , online                   :: Maybe Bool
    -- , online_only              :: Maybe Bool
    -- , renison                  :: Maybe Bool
    -- , renison_only             :: Maybe Bool
    -- , st_jerome                :: Maybe Bool
    -- , st_jerome_only           :: Maybe Bool
    , prerequisites            :: Maybe Text
    , subject                  :: Maybe Text
    , terms_offered            :: Maybe [Text]
    , title                    :: Maybe Text
    , units                    :: Maybe Float
    , url                      :: Maybe Text
} deriving (Generic, Show)


snakeToCamel :: String -> String
snakeToCamel = snakeToCamel' False
    where 
        snakeToCamel' _ []        = []
        snakeToCamel' _ ('_':xs)  = snakeToCamel' True xs
        snakeToCamel' saw_ (x:xs) = (if saw_ then C.toUpper x else x) 
                                        : snakeToCamel' False xs

instance FromJSON Course
instance ToJSON Course where
    toEncoding = genericToEncoding options where 
        options = defaultOptions {
            fieldLabelModifier = modify
        }
        modify "course_id" = "id"
        modify a = snakeToCamel a


parseInput :: ByteString -> Course
parseInput str = 
  case fromJSON $ findData $ fromJust $ decode str of
      Success a -> a
      A.Error e -> error $ printf "could not parse: %v...\nError: %v\n" (take 100 $ show str) e
    where 
      findData :: HashMap Text Value -> Value
      findData m = m ! "data"


instance ResourcefulEntity Course where
    resourceIdentifier a = fromJust $ course_id a
    resourceType = const "course"
    resourceLinks = const Nothing
    resourceMetaData = const Nothing
    resourceRelationships = const Nothing

outputDocument :: Course -> Document Course
outputDocument cs = mkDocument [cs] Nothing Nothing 

main :: IO ()
main = do
    txt <- B.getContents
    B.putStr $ encode $ outputDocument $ parseInput txt
    